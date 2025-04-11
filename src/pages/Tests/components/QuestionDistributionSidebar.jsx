import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import testServices from "../../../services/testService";

const QuestionDistributionSidebar = ({
  selectedSection,
  onSelectTopic,
  pickedQuestions,
  handleSubmit,
  subject,
}) => {
  const { id } = useParams();
  const [sections, setSections] = useState([]);

  useEffect(() => {
    fetchTestDataById(id);
  }, [id]);

  const fetchTestDataById = async (testId) => {
    try {
      const response = await testServices.getTestById(testId);
      if (response?.success && response?.data?.sections) {
        setSections(response.data.sections);
      }
    } catch (error) {
      console.error("Failed to fetch test details", error);
    }
  };

  useEffect(() => {
    if (selectedSection) {
      // Update the sections with the selected section
      setSections([selectedSection]); // Use only selected section
    }
  }, [selectedSection]);

  return (
    <div className="w-1/4 h-screen bg-white p-4 rounded-lg shadow-md flex flex-col">
      <h3
        className="font-bold text-gray-800 mb-4"
        style={{ fontSize: "1.2rem" }}
      >
        Question Distribution
      </h3>

      {/* Filter subjects and chapters based on the selected section */}
      <div className="flex-1 overflow-y-auto pr-2">
        {sections.map((section) => (
          <div key={section._id} className="mb-4">
            {section?.subjects?.map((subject, subjIndex) => {
              // Count total number of questions for the subject
              const totalQuestionsForSubject = subject?.chapter?.reduce(
                (total, chapter) => {
                  return (
                    total +
                    (chapter?.topic?.reduce(
                      (count, topic) => count + topic.numberOfQuestions,
                      0
                    ) || 0)
                  );
                },
                0
              );

              return (
                <div key={subjIndex} className="mb-4">
                  <p className="font-semibold text-gray-600 mb-2">
                    {subject.subjectName} {totalQuestionsForSubject}
                  </p>

                  {subject?.chapter?.map((chapter, chapIndex) => {
                    const totalQuestionsForChapter = chapter?.topic?.reduce(
                      (count, topic) => count + topic.numberOfQuestions,
                      0
                    );

                    // Count questions based on selected topics for chapter
                    const selectedQuestionsForChapter = chapter?.topic?.reduce(
                      (selectedCount, topic) => {
                        const topicName = topic.topicName.trim();
                        const sectionId = section._id;
                        const pickedTopicMap = Object.keys(
                          pickedQuestions?.[sectionId] || {}
                        ).find(
                          (key) =>
                            key.trim().toLowerCase() === topicName.toLowerCase()
                        );
                        return (
                          selectedCount +
                          (pickedTopicMap
                            ? Object.keys(
                                pickedQuestions[sectionId][pickedTopicMap]
                              ).length
                            : 0)
                        );
                      },
                      0
                    );

                    return (
                      <div key={chapIndex} className="ml-2 mt-2">
                        <div className="flex ">
                          <div className="">
                            <p className="text-sm font-semibold text-gray-600">
                              {chapter.chapterName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-600">
                              {" "}
                              {selectedQuestionsForChapter}
                            </p>
                          </div>
                        </div>

                        {chapter?.topic?.map((topic, topicIndex) => {
                          const topicName = topic.topicName.trim();
                          const sectionId = section._id;

                          const pickedTopicMap = Object.keys(
                            pickedQuestions?.[sectionId] || {}
                          ).find(
                            (key) =>
                              key.trim().toLowerCase() ===
                              topicName.toLowerCase()
                          );
                          const pickedCount = pickedTopicMap
                            ? Object.keys(
                                pickedQuestions[sectionId][pickedTopicMap]
                              ).length
                            : 0;

                          return (
                            <div
                              key={topicIndex}
                              className={`ml-4 flex justify-between text-sm border-l pl-3 cursor-pointer ${
                                pickedCount > 0
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-500 hover:text-indigo-600"
                              }`}
                              onClick={() => onSelectTopic(section, topic)}
                            >
                              <span style={{ fontSize: "1rem" }}>
                                {topicName.slice(0, 15)}
                              </span>
                              <span>{pickedCount}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 sticky bottom-0 bg-white">
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Review
        </button>
      </div>
    </div>
  );
};

export default QuestionDistributionSidebar;
